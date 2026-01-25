import { toast, ToastPosition, Theme } from "react-toastify";
import { PublicClient, TransactionReceipt } from "viem";
import { parseWagmiError } from "./parseWagmiError";

// Timeout for transaction confirmation (5 minutes)
const TX_RECEIPT_TIMEOUT_MS = 5 * 60 * 1000;

export const OPTIONS = {
  position: "top-center" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as Theme,
};

type WrapWithToastReturnType = {
  status: boolean;
  result?: TransactionReceipt;
};

export const infoToast = (message: string) => toast.info(message, OPTIONS);
export const successToast = (message: string) => toast.success(message, OPTIONS);
export const errorToast = (message: string) => toast.error(message, OPTIONS);

export async function wrapWithToast(
  contractWrite: () => Promise<`0x${string}`>,
  publicClient: PublicClient
): Promise<WrapWithToastReturnType> {
  infoToast("Transaction initiated");
  try {
    const hash = await contractWrite();

    // Wrap waitForTransactionReceipt in Promise.race with a timeout promise
    const receiptPromise = publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Transaction timed out after 5 minutes."));
      }, TX_RECEIPT_TIMEOUT_MS);
    });

    const res: TransactionReceipt = await Promise.race([receiptPromise, timeoutPromise]);

    const status = res.status === "success";
    if (status) successToast("Transaction mined!");
    else errorToast("Transaction reverted!");

    return { status, result: res };
  } catch (error: any) {
    if (error?.message?.toLowerCase().includes("timed out")) {
      errorToast(
        "Transaction is taking longer than expected. It may still confirm. " +
          "Please check the transaction status on the blockchain explorer."
      );
    } else {
      const msg = parseWagmiError(error) || "Something went wrong. Please try again.";
      errorToast(msg);
    }
    return { status: false };
  }
}

export async function catchShortMessage(promise: Promise<unknown>) {
  return await promise.catch((error) => errorToast(parseWagmiError(error)));
}
