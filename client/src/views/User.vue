<script>
import { useUserStore } from "../stores/store";

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {
      code: "",
      img: null,
      // update user name!
      name: "",
    };
  },
  methods: {
    submitCode() {
      this.userStore.verifyEmailCode(this.code);
    },
    upload(e) {
      // console.log(e.target.files[0]);
      const img = new FormData();
      img.append("image", e.target.files[0]);
      // console.log(img);
      this.img = img;
    },
    submitUpload() {
      this.userStore.uploadUserImage(this.img);
    },
    changeUsername() {
      this.userStore.updateUser(this.name);
      this.name = "";
    },
  },
  mounted() {
    // console.log(this.userStore.user);
  },
  // created() {
  //   this.userStore.getUserProfile();
  // },
  beforeCreate() {
    this.userStore.getUserProfile();
  },
};
</script>

<template>
  <section class="container">
    <div class="header">
      <div class="avatar">
        <!-- 1228 error 404 -->
        <img
          v-if="userStore.userProfile?.avatar"
          :src="`http://localhost:4000/image/${userStore.userProfile?.avatar}`"
          alt="avatar"
          class="avatar-img"
        />
      </div>
    </div>
    <!-- 1119 user null  -->
    <div class="profile">
      <div class="profile-control">
        <div class="profile-lable">username:</div>
        <input
          class="profile-input"
          type="text"
          :placeholder="userStore.userProfile?.name"
          v-model="name"
        />
        <small v-if="userStore.updateErrorMessage" class="danger-message">{{
          userStore.updateErrorMessage?.message
        }}</small>
      </div>
      <div class="profile-control">
        <div class="profile-lable">email:</div>
        <input
          type="email"
          :placeholder="userStore.userProfile?.email"
          class="profile-input"
          disabled
        />
        <div v-if="userStore.userProfile?.verify === 1" class="profile-verify">
          verified
        </div>
        <div v-else class="profile-unverify">
          <div v-if="userStore.isNotSendCode">
            unVerified
            <button
              class="profile-sendverify"
              @click="userStore.sendVerifyEmailCode"
            >
              <div v-if="userStore.loading" class="loading"></div>
              <span v-else>send verify code</span>
            </button>
            <small
              class="danger-message"
              v-if="userStore.verifycodeErrorMessage"
            >
              {{ userStore.verifycodeErrorMessage }}</small
            >
            <small
              class="success-message"
              v-show="userStore.verifyCodeSuccessMessage"
              >{{ userStore.verifyCodeSuccessMessage }}</small
            >
          </div>
          <div v-else>
            <input type="text" class="verify-input" v-model="code" />
            <button class="profile-sendverify">
              <span v-if="!userStore.loading" @click="submitCode">submit</span>
              <div v-else class="loading"></div>
            </button>
            <button @click="userStore.sendVerifyEmailCode">
              <div v-if="userStore.loading" class="loading"></div>
              <span v-else>send again</span>
            </button>
            <small
              class="danger-message"
              v-if="userStore.verifycodeErrorMessage"
            >
              {{ userStore.verifycodeErrorMessage }}</small
            >
            <small
              class="success-message"
              v-show="userStore.verifyCodeSuccessMessage"
              >{{ userStore.verifyCodeSuccessMessage }}</small
            >
          </div>
        </div>
      </div>

      <div class="profile-control">
        <div class="profile-lable">Your photo:</div>
        <input class="profile-input" type="file" @change="upload" />

        <button class="btn" @click="submitUpload">upload</button>
        <small v-if="userStore.uploadErrorMessage" class="danger-message">{{
          userStore.uploadErrorMessage.message
        }}</small>
      </div>

      <div class="profile-control profile-btns">
        <button class="profile-cancel btn" @click="$router.back()">
          cancel
        </button>
        <button class="profile-save btn" @click="changeUsername">save</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "../assets/user.css";
</style>
