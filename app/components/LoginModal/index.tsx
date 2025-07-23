import { Dialog } from "primereact/dialog"
import Login from "@/app/(main)/auth/login/page";
import { useUserContext } from "@/layout/context/usercontext";
import { useEffect } from "react";
interface LoginModalProps {
  visible: boolean;
  onHide: () => void;
}
function LoginModal({visible, onHide}: LoginModalProps) {
    const { user } = useUserContext();
    useEffect(()=>{
        if (user && user.id) {
            onHide()
            return; 
        }
    },[user])
  return (
    <Dialog header="ورود" visible={visible} onHide={onHide} className="w-10 md:w-6" dismissableMask={true}>
    <hr />
    <Login onlyForm />
</Dialog>
  )
}

export default LoginModal