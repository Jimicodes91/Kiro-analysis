declare module "native-forms-react" {
  import { ComponentType } from "react";

  export interface NativeFormsProps {
    /** URL of the NativeForms form to display */
    form: string;
    /** JSON format of the form (alternative to form URL) */
    formJSON?: object;
    /** Called when user decides to close the form */
    onClose?: () => void;
    /** Called when user completes and submits the form */
    onSend?: () => void;
    /** Email of person completing the form (visible in admin panel) */
    email?: string;
    /** Name of person completing the form */
    name?: string;
    /** Extra data fields sent along with the completed form (not visible to users) */
    extraData?: Record<string, unknown>;
  }

  const NativeForms: ComponentType<NativeFormsProps>;
  export default NativeForms;
}
