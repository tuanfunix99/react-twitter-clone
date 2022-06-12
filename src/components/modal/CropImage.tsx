import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import Cropper from "react-cropper";

interface UserProfileModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  photoURL: string;
  save: (value: string) => void;
}

const CropImageModal = ({
  open,
  setOpen,
  photoURL,
  save,
}: UserProfileModalProps) => {
  const [cropper, setCropper] = useState<any>();

  const onClose = () => setOpen(false);

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      save(cropper.getCroppedCanvas().toDataURL());
      setOpen(false);
    }
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="h-[400px] w-[368px]">
          <Cropper
            style={{ height: "100%", width: "100%",}}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={photoURL}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
        </div>
        <div className="w-full mt-2">
          <Button onClick={getCropData}>Save</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CropImageModal;
