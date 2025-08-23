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

/**
 * Wraps a contract write operation with toast notifications and timeout handling.
 *
 * This function provides a robust way to handle blockchain transactions with:
 * - User feedback through toast notifications
 * - Automatic timeout handling for transaction confirmations (5 minutes default)
 * - Comprehensive error handling for various failure scenarios
 *
 * Timeout Mechanism:
 * - Uses Promise.race to compete between transaction confirmation and timeout
 * - Default timeout is 5 minutes (300,000 ms) configurable via TX_RECEIPT_TIMEOUT_MS
 * - If timeout occurs, shows user-friendly message about checking blockchain explorer
 * - Timeout doesn't affect the actual transaction - it may still confirm later
 *
 * @param contractWrite - Function that returns a promise resolving to transaction hash
 * @param publicClient - Viem PublicClient for blockchain interaction
 * @returns Promise resolving to transaction status and receipt (if available)
 */
export async function wrapWithToast(
  contractWrite: () => Promise<`0x${string}`>,
  publicClient: PublicClient
): Promise<WrapWithToastReturnType> {
  infoToast("Transaction initiated");
  try {
    const hash = await contractWrite();

    // Timeout promise for transaction confirmation
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Transaction confirmation timed out after 5 minutes.")), TX_RECEIPT_TIMEOUT_MS)
    );

    const res: TransactionReceipt = await Promise.race([
      publicClient.waitForTransactionReceipt({ hash, confirmations: 2 }),
      timeoutPromise,
    ]);

    const status = res.status === "success";

    if (status) successToast("Transaction mined!");
    else errorToast("Transaction reverted!");

    return { status, result: res };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("timed out")) {
      errorToast(
        "Transaction is taking longer than expected. It may still confirm. Please check the transaction status on the blockchain explorer."
      );
    } else {
      errorToast(parseWagmiError(error));
    }
    return { status: false };
  }
}

export async function catchShortMessage(promise: Promise<unknown>) {
  return await promise.catch((error) => errorToast(parseWagmiError(error)));
}
