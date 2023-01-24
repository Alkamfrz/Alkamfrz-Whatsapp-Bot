/* eslint-disable @typescript-eslint/no-explicit-any */
import { Configuration,OpenAIApi } from "openai";

import config from "../configs/config";
import { gptCommand as respond } from "../listeners/respond"

const openAIKey = config.apiKey.openAIKey;

const gptCommand = async (msg: any, sock: any, chats: any, from: any) => {
    const configuration = new Configuration({
        apiKey: openAIKey,
      });
      const openai = new OpenAIApi(configuration);
      const text = chats.split(" ").slice(1).join(" ");
      if(!text){
          await sock.sendMessage(from, {text: respond});
      return;
    }
        const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        });
        if(response.data.choices[0].text){
            await sock.sendMessage(from, {text: response.data.choices[0].text});
        }else{
            await sock.sendMessage(from, {text: "Terjadi kesalahan pada saat mengirim pesan"})
        }
};

export default gptCommand;