import { Image } from '@/components/media/Image';
import { OTPInput } from '@/components/inputs/OTPInput';
import { FileUploader } from '@/components/inputs/FileUploader';
import { TreeView } from '@/components/tree-view';

const meaningfulImage = <Image src="/profile.jpg" alt="Profile" />;
const decorativeImage = <Image src="/texture.png" decorative />;
const uncontrolledOtp = <OTPInput defaultValue={['1', '2', '3', '4', '5', '6']} />;

// @ts-expect-error Image requires explicit alternative text or decorative intent.
const missingImageAccessibility = <Image src="/profile.jpg" />;

// @ts-expect-error Decorative images must not also provide alternative text.
const conflictingImageAccessibility = <Image src="/texture.png" decorative alt="Texture" />;

// @ts-expect-error OTPInput owns its semantic DOM structure.
const polymorphicOtp = <OTPInput asChild />;

// @ts-expect-error FileUploader owns its managed root and native file input.
const polymorphicFileUploader = <FileUploader asChild />;

// @ts-expect-error TreeView.Content owns its nested list and group semantics.
const polymorphicTreeContent = <TreeView.Content asChild />;

void meaningfulImage;
void decorativeImage;
void uncontrolledOtp;
void missingImageAccessibility;
void conflictingImageAccessibility;
void polymorphicOtp;
void polymorphicFileUploader;
void polymorphicTreeContent;
