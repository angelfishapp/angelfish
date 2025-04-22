import type { VideoContainerProps } from './VideoContainer.interface'
import { Iframe, IframeContainer, VideoMainContainer } from './VideoContainer.style'

export default function VideoContainer({ src, title }: VideoContainerProps) {
  return (
    <VideoMainContainer>
      <IframeContainer>
        <Iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </IframeContainer>
    </VideoMainContainer>
  )
}
