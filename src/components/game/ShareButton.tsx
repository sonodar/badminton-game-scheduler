import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { Fragment, useMemo, useRef } from "react";
import { HiLink } from "react-icons/hi2";
import { ShareDialog } from "./ShareDialog";
import ConfirmDialog from "@components/common/ConfirmDialog.tsx";

type Props = {
	sharedId?: string;
	onIssue: () => Promise<void>;
	isDisabled?: boolean;
};

function makeShareLink(sharedId?: string) {
	if (!sharedId) return sharedId;
	return new URL(`/share/${sharedId}`, location.origin).toString();
}

export function ShareButton({ sharedId, onIssue, isDisabled }: Props) {
	const shareLink = useMemo(() => makeShareLink(sharedId), [sharedId]);

	const { isOpen: isIssueOpen, onOpen: onIssueOpen, onClose: onIssueClose } = useDisclosure();
	const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();

	const toast = useToast();
	const toastRef = useRef<string | number>();

	const handleClick = () => {
		if (sharedId) {
			onShareOpen();
		} else {
			onIssueOpen();
		}
	};

	const handleOk = async () => {
		await onIssue();
		onIssueClose();
		toastRef.current = toast({
			title: "共有リンクを発行しました",
			status: "success",
			duration: 2000,
			isClosable: true,
			colorScheme: "brand",
			variant: "subtle",
		});
		onShareOpen();
	};

	return (
		<Fragment>
			<IconButton
				variant={"ghost"}
				colorScheme={"brand"}
				fontSize={"2xl"}
				aria-label="シェア"
				icon={<HiLink />}
				onClick={handleClick}
				isDisabled={isDisabled}
			/>
			<ConfirmDialog isOpen={isIssueOpen} onCancel={onIssueClose} onOk={handleOk} title={"共有リンクの発行"}>
				共有リンクを発行すると、現在の状態を他の人とリアルタイムで共有できます。共有リンクを発行しますか？
			</ConfirmDialog>
			<ShareDialog value={shareLink} isOpen={isShareOpen} onClose={onShareClose} />
		</Fragment>
	);
}
