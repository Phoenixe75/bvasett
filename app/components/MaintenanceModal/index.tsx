import {useUserContext} from '@/layout/context/usercontext';
import {useEffect} from 'react';
import {Dialog} from 'primereact/dialog';
import {Message} from 'primereact/message';

interface MaintenanceModalProps {
  visible: boolean;
  onHide: () => void;
}

function MaintenanceModal({visible, onHide}: MaintenanceModalProps) {
  const {user} = useUserContext();
  useEffect(() => {
    if (user && user.id) {
      onHide()
      return;
    }
  }, [user])
  return (
    <Dialog header="خطا"
            visible={visible}
            onHide={onHide}
            className="w-10 md:w-6"
            dismissableMask={true}>
      <hr/>
      <Message className="w-full" severity="warn" text="درگاه در دست تعمیر می‌باشد"/>
    </Dialog>
  )
}

export default MaintenanceModal;
