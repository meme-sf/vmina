import { PrivateKey, PublicKey, fetchAccount } from 'snarkyjs';
export declare const loopUntilAccountExists: ({ account, eachTimeNotExist, isZkAppAccount, }: {
    account: PublicKey;
    eachTimeNotExist: () => void;
    isZkAppAccount: boolean;
}) => Promise<import("snarkyjs/dist/node/lib/fetch").Account>;
interface ToString {
    toString: () => string;
}
declare type FetchedAccountResponse = Awaited<ReturnType<typeof fetchAccount>>;
declare type FetchedAccount = NonNullable<FetchedAccountResponse['account']>;
export declare const makeAndSendTransaction: <State extends ToString>({ feePayerPrivateKey, zkAppPublicKey, mutateZkApp, transactionFee, getState, statesEqual, }: {
    feePayerPrivateKey: PrivateKey;
    zkAppPublicKey: PublicKey;
    mutateZkApp: () => void;
    transactionFee: number;
    getState: () => State;
    statesEqual: (state1: State, state2: State) => boolean;
}) => Promise<void>;
export declare const zkAppNeedsInitialization: ({ zkAppAccount, }: {
    zkAppAccount: FetchedAccount;
}) => Promise<boolean>;
export {};
