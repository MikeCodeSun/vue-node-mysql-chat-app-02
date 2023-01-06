<script>
import useMessageStore from "../stores/messageStore";
import { useUserStore } from "../stores/store";
import SocketIoService from "../utils/connectSoketIo";
export default {
  setup() {
    const messageStore = useMessageStore();
    const userStore = useUserStore();
    return { messageStore, userStore };
  },
  data() {
    return {
      selectId: "",
      content: "",
      sendToUser: null,
      messageBoxContent: "",
    };
  },
  methods: {
    selectUser(id) {
      const userId = this.userStore.user.id;
      this.selectId = id;
      this.messageStore.getMessages(id);
      if (userId > id) {
        SocketIoService.joinRoom(userId + "secretroom" + id);
      } else {
        SocketIoService.joinRoom(id + "secretroom" + userId);
      }
    },
    sendMessage() {
      SocketIoService.sendMessage({
        content: this.content,
        from_user: this.userStore.user.id,
        to_user: this.selectId,
        created_at: new Date().toLocaleString(),
      });
      this.content = "";
    },
    searchUser(e) {
      console.log(e.target.value);
      this.messageStore.searchUser(e.target.value);
    },
    messageBoxSendMessage() {
      if (!this.messageBoxContent || this.messageBoxContent.trim() === "") {
        alert("please not send empty message!");
        return;
      }
      this.messageStore.sendMessage(this.messageBoxContent, this.sendToUser.id);
      this.sendToUser = null;
      this.messageBoxContent = "";
    },
  },
  created() {
    this.messageStore.getUsers();
    SocketIoService.connectSocketIo();
    SocketIoService.getMessage((data) => {
      this.messageStore.messages.push(data);
    });
  },
};
</script>

<template>
  <section class="container">
    <div class="users-container">
      <h4 class="users-title">Users</h4>

      <ul class="users-list">
        <li class="user-search">
          <input
            class="user-search-input"
            type="text"
            placeholder="send to..."
            @input="searchUser"
          />
          <ul
            v-if="messageStore.searchUserList.length !== 0"
            class="user-search-list"
          >
            <li
              class="user-search-item"
              v-for="item in messageStore.searchUserList"
              :key="item.id"
              @click="sendToUser = item"
            >
              {{ item.name }}
            </li>
          </ul>
        </li>
        <li v-for="(item, index) in messageStore.users" :key="index">
          <a
            class="user-item"
            @click="selectUser(item.id)"
            :class="{ 'user-active': item.id === selectId }"
          >
            <div>
              <img
                v-if="item.avatar"
                class="user-avatar"
                :src="'http://localhost:4000/image/' + item.avatar"
                alt="avatar"
              />
              <div class="user-no-avatar" v-else>
                <span class="user-initial">{{ item.name.slice(0, 1) }}</span>
              </div>
            </div>
            <div>{{ item.name }}</div>
          </a>
        </li>
      </ul>
    </div>
    <div class="message-container">
      <h4 class="users-title">Messages</h4>
      <ul class="message-list">
        <li
          v-if="messageStore.messages"
          class="message-item"
          v-for="item in messageStore.messages.slice().reverse()"
          :key="item.id"
          :class="[
            item.from_user === userStore.user.id
              ? 'message-from-user'
              : 'message-to-user',
          ]"
        >
          {{ item.content }}
        </li>
      </ul>
      <div class="message-bottom">
        <textarea
          class="message-input"
          v-model="content"
          :disabled="!selectId"
        ></textarea>
        <button class="btn message-btn" @click="sendMessage">send</button>
      </div>
    </div>
  </section>
  <!-- message box modal -->
  <div v-if="sendToUser" class="message-box">
    <p>send to: {{ sendToUser.name }}</p>

    <textarea class="message-input" v-model="messageBoxContent"></textarea>
    <button class="btn message-btn" @click="messageBoxSendMessage">send</button>
    <button
      class="btn message-btn message-box-cancel-btn"
      @click="sendToUser = ''"
    >
      cancel
    </button>
  </div>
</template>

<style scoped>
@import "../assets/chat.css";
</style>
