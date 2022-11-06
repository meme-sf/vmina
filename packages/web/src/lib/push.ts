import * as PushAPI from '@pushprotocol/restapi';
import * as ethers from 'ethers';

const PK = process.env.PUSH_KEY; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

const sendNotification = async (recipient: string) => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`,
      },
      payload: {
        title: `[sdk-test] payload title`,
        body: `sample msg body`,
        cta: '',
        img: '',
      },
      //   'eip155:5:0xCdBE6D076e05c5875D90fa35cc85694E1EAFBBd1'
      recipients: recipient, // recipient address
      //   'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      channel: '0xb3dfC8C1B6116Cd1B6ffAB9Fe759689Bb9601cA1', // your channel address
      env: 'staging',
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log('API repsonse: ', apiResponse);
  } catch (err) {
    console.error('Error: ', err);
  }
};

sendNotification();
