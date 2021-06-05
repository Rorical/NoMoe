<template>
    <section class="section">
        <div class="container is-fluid">
            <b-steps
            :has-navigation="false"
            v-model="nowStep">
                <b-step-item step="1" :label="$t('app.welcome.step1.title')">
                    <h1 class="title has-text-centered">{{ $t('app.welcome.step1.title') }}</h1>
                    <p class="content has-text-centered">
                        {{ $t('app.welcome.step1.description') }}
                    </p>
                    <section class="section">
                        <b-message title="NoMoe" type="is-info">
                            {{ $t('app.welcome.step1.content.introduction') }}
                        </b-message>
                        <HoverSelector :items='[{title:this.$t("app.general.continue"), color:"success", click: this.continue}]'/>
                    </section>
                </b-step-item>
                <b-step-item step="2" :label="$t('app.welcome.step2.title')">
                    <h1 class="title has-text-centered">{{ $t('app.welcome.step2.title') }}</h1>
                    <p class="content has-text-centered">
                        {{ $t('app.welcome.step2.description') }}
                    </p>
                    <section class="section has-text-centered">
                        <HoverSelector :items="step2.items" v-if="step2.choice == 0"/>
                        <div class="container" v-else>
                            <template v-if="step2.choice == 1">
                                <b-field label="助记词">
                                    <b-notification>
                                        <ClickToShow :text="step2.choice1.show.mnemonic" />
                                    </b-notification>
                                </b-field>
                                <b-field label="私钥">
                                    <b-notification>
                                        <ClickToShow :text="step2.choice1.show.privKey" />
                                    </b-notification>
                                </b-field>
                                <p>请妥善将助记词或者私钥抄写在纸上并保存好</p>
                            </template>
                            <template v-else-if="step2.choice == 2">
                                <b-field label="助记词">
                                    <b-input type="textarea" v-model="step2.choice2.show.mnemonic"></b-input>
                                </b-field>
                            </template>
                            <template v-else-if="step2.choice == 3">
                                <b-field label="JSON内容">
                                    <b-input type="textarea" v-model="step2.choice3.show.json"></b-input>
                                </b-field>
                                <b-field label="解锁密码" label-position="on-border">
                                    <b-input type="password" v-model="step2.choice3.show.password" password-reveal></b-input>
                                    <p class="control">
                                        <b-button type="is-primary" @click="step2JsonDecode()">确认</b-button>
                                    </p>
                                </b-field>
                                <b-field label="私钥结果">
                                    <b-notification>
                                        <ClickToShow :text="step2.choice3.show.privKey" />
                                    </b-notification>
                                </b-field>

                            </template>
                            <template v-else-if="step2.choice == 4">
                                <b-field label="私钥">
                                    <b-input type="textarea" v-model="step2.choice4.show.privKey"></b-input>
                                </b-field>
                            </template>
                            <hr class="is-medium">
                            <b-field label="设置密码">
                                <b-input type="password" v-model="step2.password" password-reveal></b-input>
                            </b-field>
                            <hr class="is-medium">
                            <HoverSelector :items='[ {title:this.$t("app.general.continue"), color:"success", click: this.step2ChoiceContinue}, {title:this.$t("app.general.back"), color:"danger", click: ()=>this.setStep2Choice(0)} ]'/>
                        </div>
                    </section>
                </b-step-item>
                <b-step-item step="3" :label="$t('app.welcome.step3.title')">
                    <h1 class="title has-text-centered">{{ $t('app.welcome.step3.title') }}</h1>
                    <p class="content has-text-centered">
                        {{ $t('app.welcome.step3.description') }}
                    </p>
                    <section class="section">
                        <b-field label="IPFS接口地址">
                            <b-input v-model="step3.ipfsUrl"></b-input>
                        </b-field>
                        <b-field >
                            <b-button type="is-info" @click="changeIpfsUrl()">设置</b-button>
                        </b-field>
                        <hr class="is-medium">
                        <HoverSelector :items='[ {title:this.$t("app.general.continue"), color:"success", click: this.finish}]'/>
                    </section>
                </b-step-item>
            </b-steps>
        </div>
    </section>
</template>


<script>
import HoverSelector from '@/components/hover-selector.vue'
import ClickToShow from '@/components/click-to-show.vue'

export default {
    name: 'Welcome',
    components: {
        HoverSelector,
        ClickToShow
    },
    data() {
        return {
            listeners: [],
            nowStep: 0,
            step2: {
                items: [
                    {
                        title: this.$t("app.welcome.step2.content.item1.title"),
                        subTitle: this.$t("app.welcome.step2.content.item1.subtitle"),
                        click: ()=>this.setStep2Choice(1),
                        color: 'info'
                    },
                    {
                        title: this.$t("app.welcome.step2.content.item2.title"),
                        subTitle: this.$t("app.welcome.step2.content.item2.subtitle"),
                        click: ()=>this.setStep2Choice(2),
                        color: 'primary'
                    },
                    {
                        title: this.$t("app.welcome.step2.content.item3.title"),
                        subTitle: this.$t("app.welcome.step2.content.item3.subtitle"),
                        click: ()=>this.setStep2Choice(3),
                        color: 'success'
                    },
                    {
                        title: this.$t("app.welcome.step2.content.item4.title"),
                        subTitle: this.$t("app.welcome.step2.content.item4.subtitle"),
                        click: ()=>this.setStep2Choice(4),
                        color: 'secondary'
                    },
                ],
                choice: 0,
                choice1:{
                    show: {
                        mnemonic: "",
                        privKey: ""
                    }
                },
                choice2: {
                    show: {
                        mnemonic: "",
                    }
                },
                choice3: {
                    show: {
                        json: "",
                        password: "",
                        privKey: ""
                    }
                },
                choice4: {
                    show: {
                        privKey: ""
                    }
                },
                finalMnemonic: "",
                finalPrivKey: "",
                password: ""
            },
            step3: {
                ipfsUrl: "http://localhost:5001/api/v0"
            }
        }
    },
    created() {
        this.listeners.push(
            window.ipcRenderer.on('resultCreateUserIdentityByRandom', this.resultCreateUserIdentityByRandom),
            window.ipcRenderer.on('resultSaveUserIdentity', this.resultSaveUserIdentity),
            window.ipcRenderer.on('resultGetPrivKeyFromJson', this.resultGetPrivKeyFromJson)
        )
    },
    beforeDestroy() {
        this.listeners.forEach((listener) => {
            listener.remove()
        })
    },
    watch: {
        "step2.choice2.show.mnemonic": function(val) {
            this.step2.finalMnemonic = val
        },
        "step2.choice4.show.privKey": function(val) {
            this.step2.finalPrivKey = val
        }
    },
    methods: {
        step2ChoiceChange(){
            this.step2.choice1.show.mnemonic = ""
            this.step2.choice1.show.privKey = ""
            this.step2.choice2.show.mnemonic = ""
            this.step2.choice3.show.json = ""
            this.step2.choice3.show.privKey = ""
            this.step2.choice3.show.password = ""
            this.step2.choice4.show.privKey = ""
            this.step2.password = ""
            this.step2.finalPrivKey = ""
            this.step2.finalMnemonic = ""

            if(this.step2.choice == 1) {
                window.ipcRenderer.send("createUserIdentityByRandom")
            }
        },
        setStep2Choice(choice){
            this.step2.choice = choice
            this.step2ChoiceChange()
        },
        step2JsonDecode(){
            window.ipcRenderer.send("getPrivKeyFromJson", {
                "data": {
                    "json": this.step2.choice3.show.json,
                    "password": this.step2.choice3.show.password
                }
            })
        },
        step2ChoiceContinue(){  
            if(this.step2.choice != 0){
                if(this.step2.finalPrivKey == "" && this.step2.finalMnemonic == ""){
                        this.raiseError("app.welcome.error.empty.keyinfo")
                        return
                }
                if(this.step2.password == ""){
                    this.raiseError("app.welcome.error.empty.password")
                    return
                }
                if(this.step2.finalPrivKey != ""){
                    window.ipcRenderer.send("saveUserIdentity", {
                        "type": "privateKey",
                        "data": {
                            "privateKey": this.step2.finalPrivKey.replace("\n", ""),
                            "password": this.step2.password
                        }
                    })
                }else{
                    window.ipcRenderer.send("saveUserIdentity", {
                        "type": "mnemonic",
                        "data": {
                            "mnemonic": this.step2.finalMnemonic.replace("\n", ""),
                            "password": this.step2.password
                        }
                    })
                }
            }
        },
        continue(){
            this.nowStep += 1
        },
        resultCreateUserIdentityByRandom(result){
            if(result["type"] == "success"){
                this.step2.choice1.show.mnemonic = result["data"]["mnemonic"]["phrase"]
                this.step2.choice1.show.privKey = result["data"]["privKey"]
                this.step2.finalPrivKey = result["data"]["privKey"]
            }
        },
        resultSaveUserIdentity(result){
            if(result["type"] == "error"){
                this.raiseError(result["error"])
            }else{
                this.step2.password = ""
                this.step2.finalPrivKey = ""
                this.step2.finalMnemonic = ""
                this.step2.choice = 0
                this.continue()
            }
        },
        raiseError(err){
            this.$buefy.notification.open({
                duration: 5000,
                message: this.$t(err),
                position: 'is-bottom-right',
                type: 'is-danger'
            })
        },
        resultGetPrivKeyFromJson(data){
            if(data["type"] == "error"){
                this.raiseError(data["error"])
            }else{
                this.step2.choice3.show.privKey = data["data"]["privKey"]
                this.step2.finalPrivKey = data["data"]["privKey"]
            }
        },
        changeIpfsUrl(){
            if(this.step3.ipfsUrl != ""){
                window.ipcRenderer.send("setIPFSUrl", this.step3.ipfsUrl)
                this.$buefy.notification.open({
                    duration: 5000,
                    message: this.$t("app.welcome.success.setipfs"),
                    position: 'is-bottom-right',
                    type: 'is-success'
                })
            }else{
                this.raiseError("app.welcome.error.invalid.url")
            }
        },
        finish() {
            window.ipcRenderer.send("setInitialzed", true)
            this.$router.push({ path: '/' })
        }
    }
}
</script>

<style lang="scss">
 
</style>