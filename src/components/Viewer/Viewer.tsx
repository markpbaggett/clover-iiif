import React from "react";
import { styled } from "@stitches/react";
import {
  ExternalResourceTypes,
  IIIFExternalWebResource,
  InternationalString,
  ManifestNormalized,
} from "@hyperion-framework/types";
import {
  getLabel,
  getPaintingResource,
  getSupplementingResources,
} from "hooks/use-hyperion-framework";
import Media from "components/Media/Media";
import Navigator from "components/Navigator/Navigator";
import Player from "components/Player/Player";
import { useViewerState } from "context/viewer-context";
import ImageViewer from "components/ImageViewer/ImageViewer";
import { theme } from "theme";

interface ViewerProps {
  manifest: ManifestNormalized;
}

const Viewer: React.FC<ViewerProps> = ({ manifest }) => {
  // Get Context state
  const viewerState: any = useViewerState();
  const { activeCanvas, vault } = viewerState;

  // Track some local state
  const [painting, setPainting] = React.useState<
    IIIFExternalWebResource | undefined
  >(undefined);
  const [isMedia, setIsMedia] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState<number>(0);

  // Runs every time a new viewer item is clicked
  React.useEffect(() => {
    const painting = getPaintingResource(vault, activeCanvas);
    if (painting) {
      setIsMedia(
        ["Audio", "Video"].indexOf(painting.type as ExternalResourceTypes) > -1
          ? true
          : false,
      );
      setPainting({ ...painting });
    }
  }, [activeCanvas]);

  const resources = getSupplementingResources(vault, activeCanvas, "text/vtt");

  const handleCurrentTime = (t: number) => {
    setCurrentTime(t);
  };

  return (
    <ViewerWrapper className={theme}>
      <Header>
        <span>{getLabel(manifest.label as InternationalString, "en")}</span>
      </Header>
      <ViewerInner>
        <Main>
          {isMedia ? (
            <Player
              painting={painting as IIIFExternalWebResource}
              resources={resources}
              currentTime={handleCurrentTime}
            />
          ) : (
            <ImageViewer {...(painting as IIIFExternalWebResource)}>
              Ima placeholder for the image
            </ImageViewer>
          )}
          <Media items={manifest.items} activeItem={0} />
        </Main>
        {resources.length > 0 && (
          <Aside>
            <Navigator
              activeCanvas={activeCanvas}
              currentTime={currentTime}
              defaultResource={resources[0].id as string}
              resources={resources}
            />
          </Aside>
        )}
      </ViewerInner>
    </ViewerWrapper>
  );
};

const ViewerWrapper = styled("section", {
  display: "flex",
  flexDirection: "column",
  padding: "1.618rem",
  fontFamily: theme.font.sans,
  backgroundColor: theme.color.secondary,
  fontSmooth: "auto",
  webkitFontSmoothing: "antialiased",
});

const ViewerInner = styled("div", {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
});

const Main = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  flexShrink: "1",
  width: "61.8%",
});

const Aside = styled("aside", {
  display: "flex",
  flexGrow: "1",
  flexShrink: "0",
  width: "38.2%",
});

const Header = styled("header", {
  display: "flex",
  backgroundColor: "transparent !important",

  span: {
    fontSize: "1.25rem",
    fontWeight: "700",
    padding: "1rem 0 1.25rem",
    fontFamily: theme.font.display,
  },
});

export default Viewer;
