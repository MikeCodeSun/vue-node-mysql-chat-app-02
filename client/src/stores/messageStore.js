import { defineStore } from "pinia";
import axios from "axios";

export default defineStore("message", {
  state: () => {
    return {
      users: null,
      messages: null,
      searchUserList: [],
    };
  },
  actions: {
    getUsers() {
      axios
        .get("message/users")
        .then((res) => {
          // console.log(res);
          this.users = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMessages(to) {
      axios
        .get(`message/${to}`)
        .then((res) => {
          // console.log(res.data);
          this.messages = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchUser(name) {
      console.log(name);
      if (!name || name.trim() === "") {
        this.searchUserList = [];
        return;
      }

      axios
        .get(`message/user/search/${name}`)
        .then((res) => {
          console.log(res.data);
          this.searchUserList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    sendMessage(content, to) {
      console.log(content, to);
      axios
        .post(`message/${to}`, { content })
        .then((res) => {
          // console.log(res.data);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
