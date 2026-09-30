import type { PhotoData } from "@/content/site";
export function Photo({photo, className="", priority=false}:{photo:PhotoData;className?:string;priority?:boolean}) {
 return <div className={"photo "+className} data-photo-slot={photo.id}>
  {photo.src ? <img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 700px) 100vw, 60vw" alt={photo.alt} loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"} decoding="async" style={{objectPosition:photo.position||"center"}}/> :
  <div className="photo-empty" role="img" aria-label="Photo placeholder"><span className="photo-corner corner-tl"/><span className="photo-corner corner-br"/><span className="photo-label">FOTO AQUI</span><span className="photo-slot">{photo.id.replace("-"," / ").toUpperCase()}</span></div>}
 </div>
}
