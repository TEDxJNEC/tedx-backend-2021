import axios from 'axios';

export const getGToken = async (code:string)=>{
    try {
        const {data} = await axios({
            url:process.env.GOOGLE_TOKEN_URL,
            method:'post',
            data:{
                client_id:process.env.GOOGLE_CLIENT_ID,
                client_secret:process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri:process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
                code,
            }
        });
        return data.acess_token;
    } catch (error) {
        console.log(error);
        return error;
        
    }


}

export const  getGoogleUserInfo = async (access_token:string) =>{
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(data); // { id, email, given_name, family_name }
    return data;
  };