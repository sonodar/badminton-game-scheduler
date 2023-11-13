import { ChakraProvider, Container } from "@chakra-ui/react";
import { array } from "@doubles-member-generator/manager";
import React, { useState } from "react";
import storage from "../util/settingsStorage";
import { parseShareLink } from "../util/shareLink";
import SharedPane from "./game/SharedPane";
import GamePane from "@components/game/GamePane.tsx";
import InitialSettingPane from "@components/setting/InitialSettingPane.tsx";
import customTheme from "@components/theme.ts";

export default function Main() {
  const sharedId = parseShareLink(window.location);

  if (sharedId) {
    return (
      <ChakraProvider theme={customTheme}>
        <Container maxW={"sm"} minW={"sm"}>
          <SharedPane sharedId={sharedId} />
        </Container>
      </ChakraProvider>
    );
  }

  const [settings, setSettings] = useState(storage.get());
  const [shareId, setShareId] = useState(
    window.localStorage.getItem("shareId"),
  );

  const onStart = ({
    courtCount,
    memberCount,
  }: {
    courtCount: number;
    memberCount: number;
  }) => {
    const members = array.generate(memberCount);
    setSettings({ courtCount, members, histories: [], gameCounts: {} });
  };

  const onReset = () => {
    setSettings(null);
    setShareId(null);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Container maxW={"sm"} minW={"sm"}>
        {settings === null && <InitialSettingPane onStart={onStart} />}
        {settings !== null && (
          <GamePane
            initialSettings={settings}
            onReset={onReset}
            shareId={shareId}
          />
        )}
      </Container>
    </ChakraProvider>
  );
}
