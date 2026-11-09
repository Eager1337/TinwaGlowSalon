import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export default function Lightbox({
  image,
  close,
}: {
  image: { src: string; title: string };
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog ref={ref} className="photo-dialog" onCancel={close} aria-label={image.title}>
      <button className="close-button" onClick={close} aria-label="Close photo">
        <X />
      </button>
      <img src={image.src} alt={image.title} />
      <p>{image.title} · Illustrative treatment image</p>
    </dialog>
  );
}
