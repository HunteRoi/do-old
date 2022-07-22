import { UserInfo } from 'firebase/auth';
import { facebookConfig } from '../config';

const getPhotoURL = async (providerData: UserInfo): Promise<string | null> => {
    let photoURL = providerData.photoURL;

    if (providerData.providerId === 'facebook.com') {
        const token = `${facebookConfig.appId}|${facebookConfig.appSecret}`;
        const response = await fetch(`${photoURL}?access_token=${token}&redirect=0`);
        const json = await response.json();
        photoURL = json.data.url;
    }

    return photoURL;
};

export default getPhotoURL;