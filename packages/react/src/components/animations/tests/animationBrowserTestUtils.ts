export interface MotionFrame {
  opacity: number;
  strokeDasharray: string;
  strokeDashoffset: string;
  transform: string;
}

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

export const createDeferred = <T>(): Deferred<T> => {
  let resolvePromise: ((value: T) => void) | undefined;
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });

  return {
    promise,
    resolve: (value) => resolvePromise?.(value),
  };
};

const nextAnimationFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const identityTransforms = [
  'none',
  'matrix(1, 0, 0, 1, 0, 0)',
  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
];

const isIdentityTransform = (transform: string) => identityTransforms.includes(transform);

export const readMotionFrame = (element: Element): MotionFrame => {
  const styles = getComputedStyle(element);
  const attributeOpacity = element.getAttribute('opacity');
  return {
    opacity: Number(attributeOpacity ?? styles.opacity),
    strokeDasharray: element.getAttribute('stroke-dasharray') ?? styles.strokeDasharray,
    strokeDashoffset: element.getAttribute('stroke-dashoffset') ?? styles.strokeDashoffset,
    transform: styles.transform,
  };
};

export const readDrawProgress = ({ strokeDasharray }: MotionFrame) =>
  Number.parseFloat(strokeDasharray);

export const isActiveMotionFrame = ({ opacity, transform }: MotionFrame) =>
  opacity < 0.99 ? true : !isIdentityTransform(transform);

export const isTerminalMotionFrame = ({ opacity, transform }: MotionFrame) =>
  opacity >= 0.999 && isIdentityTransform(transform);

export const observeMotionUntilSettled = async (
  observed: readonly Element[],
  mustAnimate: readonly Element[] = observed,
  timeoutMs = 4_000,
) => {
  const histories = new Map<Element, MotionFrame[]>(
    observed.map((element) => [element, [readMotionFrame(element)]]),
  );
  const animated = new Set<Element>();

  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    await nextAnimationFrame();
    observed.forEach((element) => {
      const frame = readMotionFrame(element);
      histories.get(element)?.push(frame);
      if (isActiveMotionFrame(frame)) animated.add(element);
    });

    if (
      mustAnimate.every((element) => animated.has(element)) &&
      observed.every((element) => isTerminalMotionFrame(readMotionFrame(element)))
    ) {
      return histories;
    }
  }

  throw new Error('Motion elements did not animate and settle within the frame budget.');
};

export const waitForActiveMotion = async (elements: readonly Element[], timeoutMs = 2_000) => {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    await nextAnimationFrame();
    if (elements.some((element) => isActiveMotionFrame(readMotionFrame(element)))) return;
  }
  throw new Error('No active motion frame was observed.');
};

export const waitForTerminalMotion = async (elements: readonly Element[], timeoutMs = 2_000) => {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    await nextAnimationFrame();
    if (elements.every((element) => isTerminalMotionFrame(readMotionFrame(element)))) return;
  }
  throw new Error('Motion elements did not reach their terminal state.');
};

export const expectTerminalMotionPromptly = async (
  elements: readonly Element[],
  stableFrames = 2,
) => {
  await nextAnimationFrame();
  for (let frameIndex = 0; frameIndex < stableFrames; frameIndex += 1) {
    await nextAnimationFrame();
    if (!elements.every((element) => isTerminalMotionFrame(readMotionFrame(element)))) {
      throw new Error('Motion elements did not stay terminal after policy changed.');
    }
  }
};

export const collectTerminalFrames = async (elements: readonly Element[], frameCount = 8) => {
  const frames: MotionFrame[][] = [];
  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    await nextAnimationFrame();
    frames.push(elements.map(readMotionFrame));
  }
  return frames;
};
