import { useSelector } from "react-redux";
import CreateQrCodePage from "../create-qr-code/create-qr-code.page";

export default function CloneQrCodePage(props) {
  const qrCode = useSelector((state) => state?.qrCode);

  return (
    <>
      <CreateQrCodePage initialData={qrCode} isClone={true} />
    </>
  );
}
