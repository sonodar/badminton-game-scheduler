import { RepeatClockIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  HStack,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import type { CurrentSettings } from "@doubles-member-generator/manager";
import {
  generate,
  retry,
  join,
  leave,
  getLatestMembers,
} from "@doubles-member-generator/manager";
import React, { useEffect, useRef, useState } from "react";
import { IoDiceOutline } from "react-icons/io5";
import {
  createEnvironment,
  eventEmitter,
  finishEnvironment,
} from "@doubles-member-generator/api";
import storage from "../../util/settingsStorage";
import { ShareButton } from "./ShareButton";
import CourtMembersPane from "@components/game/CourtMembersPane";
import { CurrentMemberCountInput } from "@components/game/CurrentMemberCountInput";
import { HistoryButton } from "@components/game/HistoryButton";
import { MemberButton } from "@components/game/MemberButton";
import { ResetButton } from "@components/game/ResetButton";

type Props = {
  initialSettings: CurrentSettings;
  onReset: () => void;
  shareId?: string | null;
};

export default function GamePane({ initialSettings, onReset, shareId }: Props) {
  const courtCount = initialSettings.courtCount;

  const [settings, setSettings] = useState(initialSettings);
  const latestMembers =
    settings.histories.length > 0 ? getLatestMembers(settings) : [];

  const [environmentId, setEnvironmentId] = useState(shareId || undefined);
  const [progress, setProgress] = useState(false);

  const openProgress = () => setProgress(true);
  const closeProgress = () => setProgress(false);

  const issueShareLink = async () => {
    openProgress();
    const { id } = await createEnvironment();
    window.localStorage.setItem("shareId", id);
    setEnvironmentId(id);
    await eventEmitter(id).initialize(settings);
    closeProgress();
  };

  useEffect(() => {
    storage.save({ ...settings });
  }, [settings]);

  const handleJoin = () => {
    setSettings(join(settings));
    if (environmentId) {
      eventEmitter(environmentId).join();
    }
  };

  const handleGenerate = () => {
    const newSettings = generate(settings);
    setSettings(newSettings);
    if (environmentId) {
      const members = getLatestMembers(newSettings)!;
      eventEmitter(environmentId).generate(members);
    }
  };

  const handleRetry = () => {
    const newSettings = retry(settings);
    setSettings(newSettings);
    if (environmentId) {
      const members = getLatestMembers(newSettings)!;
      eventEmitter(environmentId).retry(members);
    }
  };

  const toast = useToast();
  const toastRef = useRef<string | number>();

  const handleLeave = (id: number) => {
    setSettings(leave(settings, id));
    if (environmentId) {
      eventEmitter(environmentId).leave(id);
    }
    toastRef.current = toast({
      title: `メンバー ${id} が離脱しました`,
      status: "warning",
      duration: 2000,
      isClosable: true,
      colorScheme: "brand",
      variant: "subtle",
    });
  };

  const clear = () => {
    storage.clear();
    window.localStorage.removeItem("shareId");
    if (environmentId) {
      eventEmitter(environmentId).finish();
      finishEnvironment(environmentId);
    }
    onReset();
  };

  return (
    <Card my={1} py={4} height={"100dvh"}>
      <CardBody>
        <Center>
          <Stack spacing={6}>
            <CurrentMemberCountInput
              members={settings.members}
              value={settings.members.length}
              min={courtCount * 4}
              onIncrement={handleJoin}
              onDecrement={handleLeave}
              isDisabled={progress}
            />
            <HStack>
              <Button
                colorScheme={"brand"}
                leftIcon={<IoDiceOutline />}
                onClick={handleGenerate}
                isDisabled={progress}
              >
                メンバー決め
              </Button>
              <Spacer />
              <Button
                variant={"outline"}
                leftIcon={<RepeatClockIcon />}
                size={"xs"}
                onClick={handleRetry}
                isDisabled={progress || settings.histories.length === 0}
              >
                やり直し
              </Button>
            </HStack>
            <CourtMembersPane members={latestMembers || []} />
          </Stack>
        </Center>
      </CardBody>
      <Divider color={"gray.300"} />
      <CardFooter px={10} py={2}>
        <HistoryButton {...settings} isDisabled={progress} />
        <Spacer />
        <MemberButton {...settings} isDisabled={progress} />
        <Spacer />
        <ShareButton
          sharedId={environmentId}
          onIssue={issueShareLink}
          isDisabled={progress}
        />
        <Spacer />
        <ResetButton onReset={clear} isDisabled={progress} />
      </CardFooter>
    </Card>
  );
}
