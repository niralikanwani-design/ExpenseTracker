import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAuthWrapperProps } from '../../types/index'

const clientId = "425991820258-7p2k210jo0r2n3627jgs2gbbif92dpq4.apps.googleusercontent.com";

export default function GoogleAuthWrapper({ children } : GoogleAuthWrapperProps) {
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}   