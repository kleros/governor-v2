"use client";

import { useState } from "react";

import { Button } from "@kleros/ui-components-library";
import Link from "next/link";

import { usePublicClient } from "wagmi";

import { useFetchSession } from "@/hooks/useFetchSession";
import { useSimulateExecuteSubmissions, useWriteExecuteSubmissions } from "@/hooks/useGovernor";
import { useSessionEnd } from "@/hooks/useSessionEnd";
import { useSessionStart } from "@/hooks/useSessionStart";

import { EnsureChain } from "@/components/EnsureChain";
import { Skeleton } from "@/components/Skeleton";
import WrapWithCountdown from "@/components/WrapWithCountdown";

import Calendar from "@/assets/svgs/icons/calendar.svg";
import KlerosIcon from "@/assets/svgs/icons/kleros.svg";

import { formatDate, isUndefined } from "@/utils";
import { wrapWithToast } from "@/utils/wrapWithToast";

import { COURT_SITE } from "@/consts";
import { Governor } from "@/consts/governors";

const SessionInfo: React.FC<{ address: Governor["address"] }> = ({ address }) => {
  const [isSending, setIsSending] = useState(false);
  const publicClient = usePublicClient();
  const { data: sessionStart } = useSessionStart(address);
  const sessionEnd = useSessionEnd(address);
  const { data: session } = useFetchSession(address);

  const buttonText = () => {
    if (isUndefined(session)) return "";
    if (session.submittedLists.length > 1) return "Raise Dispute";
    else if (session.submittedLists.length === 0) return "New Session";
    else return "Execute Submissions";
  };

  const {
    data: executeConfig,
    isLoading: isLoadingConfig,
    isError,
    refetch,
  } = useSimulateExecuteSubmissions({
    query: {
      enabled: !isUndefined(sessionEnd),
    },
    address,
  });

  const { writeContractAsync: executeSubmissions } = useWriteExecuteSubmissions();
  return (
    <>
      <div className="flex gap-2 items-start md:items-center">
        <Calendar className="size-4 shrink-0" />
        {sessionStart ? (
          <small className="text-sm text-klerosUIComponentsSecondaryText">
            Session: Votes approved before {formatDate(Number(sessionStart), true)}
          </small>
        ) : (
          <Skeleton className="ml-2 w-30 h-4 inline-block" />
        )}
      </div>
      {sessionEnd ? (
        <WrapWithCountdown date={Number(sessionEnd) * 1000} text="Session ends in $$$" onComplete={refetch}>
          {session?.disputeID ? (
            <Link href={`${COURT_SITE}/cases/${session.disputeID}/overview`} target="_blank" rel="noreferrer">
              <Button small Icon={KlerosIcon} text={`View Case #${session.disputeID ?? 0}`} />
            </Link>
          ) : (
            <EnsureChain>
              <Button
                text={buttonText()}
                small
                isDisabled={isLoadingConfig || isSending || isError}
                isLoading={isLoadingConfig || isSending}
                onPress={async () => {
                  if (publicClient && executeConfig?.request) {
                    setIsSending(true);
                    wrapWithToast(async () => await executeSubmissions(executeConfig.request), publicClient).finally(
                      () => setIsSending(false)
                    );
                  }
                }}
              />
            </EnsureChain>
          )}
        </WrapWithCountdown>
      ) : null}
    </>
  );
};

export default SessionInfo;
