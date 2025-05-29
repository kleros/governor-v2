"use client";

import { useReadLastApprovalTime } from "@/hooks/useGovernor";

import { Skeleton } from "@/components/Skeleton";

import Calendar from "@/assets/svgs/icons/calendar.svg";

import { Governor } from "@/consts/governors";

import { DEFAULT_CHAIN } from "@/consts";
import { formatDate } from "@/utils";

const SessionInfo: React.FC<{ address: Governor["address"] }> = ({ address }) => {
  const { data: lastApprovalTime } = useReadLastApprovalTime({
    query: {
      staleTime: 5000,
    },
    address,
    chainId: DEFAULT_CHAIN.id,
  });

  return (
    <div className="flex gap-2 items-start md:items-center">
      <Calendar className="size-4 shrink-0" />
      <small className="text-sm text-klerosUIComponentsSecondaryText">
        Session: Votes approved before{" "}
        <span className="text-sm text-klerosUIComponentsSecondaryText">
          {lastApprovalTime ? (
            `${formatDate(Number(lastApprovalTime), true)}`
          ) : (
            <Skeleton className="w-10 h-3 inline-block" />
          )}
        </span>
      </small>
    </div>
  );
};

export default SessionInfo;
