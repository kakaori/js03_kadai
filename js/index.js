const themewords = ["机", "椅子", "本", "鉛筆", "ペン", "ノート", "カバン", "時計", "カレンダー", "ガラス", "ドア", "窓", "テレビ", "冷蔵庫", "電子レンジ", "扇風機", "照明", "洗濯機", "ソファ", "クッション",
"ベッド", "枕", "布団", "掃除機", "ダストパン", "箒", "ゴミ箱", "ハンカチ", "財布", "靴", "傘", "スカーフ", "ジーンズ", "シャツ", "靴下", "時計", "財布", "バッグ", "カメラ",
"イヤホン", "ヘッドフォン", "マウス", "キーボード", "スマートフォン", "モバイルバッテリー", "ゲーム", "ベッドルーム", "リビングルーム", "ダイニングルーム", "キッチン", "バスルーム", "トイレ", "シャワー", "バスタブ", "洗面台", "鏡", "タオル",
"シャンプー", "コンディショナー", "ボディーソープ", "歯磨き粉", "歯ブラシ", "トイレットペーパー", "ティッシュ", "ソース", "醤油", "ケチャップ", "マヨネーズ", "マスタード", "ハチミツ", "ソーセージ", "ハム", "チーズ", "ヨーグルト", "卵", "パン",
"米", "麺", "肉", "魚", "野菜", "果物", "ジュース", "お茶", "コーヒー", "水", "ビール", "ワイン", "お酒", "ケーキ", "クッキー", "チョコレート", "アイスクリーム", "ポテトチップス", "スナック", "パンケーキ",
"ピザ", "ハンバーガー", "サンドイッチ", "寿司", "ラーメン", "カレー", "焼肉", "しゃぶしゃぶ", "鍋", "天ぷら", "唐揚げ", "焼き鳥", "串カツ", "たこ焼き", "お好み焼き", "フライドチキン", "ステーキ", "ホットドッグ", "タコス"];



for(let i=0; i<themewords.length; i++){
    $("#word_list").append('<li class="py-2 px-4 mb-2 border-r">'+ themewords[i] +'</li>');
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, update, onChildChanged }
from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwapTF1UqtZ6NaJWZku07IvTPoDYbzIfs",
    authDomain: "ideageneration-a68ad.firebaseapp.com",
    databaseURL: "https://ideageneration-a68ad-default-rtdb.firebaseio.com",
    projectId: "ideageneration-a68ad",
    storageBucket: "ideageneration-a68ad.appspot.com",
    messagingSenderId: "823273349695",
    appId: "1:823273349695:web:794038a8219a655896ce8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // RealtimeDatabase使うよ

//###############################################
//GoogleAuth用
//###############################################
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();



//###############################################
//Loginしていれば処理します
//###############################################
onAuthStateChanged(auth, (user) => {

    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;

        const dbRef01 = ref(db, "users/"+uid+"/spet01/"); // RealtimeDatabase”step01“を使うよ
        const dbRef02 = ref(db, "users/"+uid+"/spet02/");
        const dbRef03 = ref(db, "users/"+uid+"/spet03/");

        //ユーザー情報取得できます
        if (user !== null) {
            user.providerData.forEach((profile) => {
                //Login情報取得
                $("#uname").text(profile.displayName);
                // $("#prof").attr("src",profile.photoURL);
                // console.log("Sign-in provider: " + profile.providerId);
                // console.log("Provider-specific UID: " + profile.uid);
                // console.log("Email: " + profile.email);
                // console.log("Photo URL: " + profile.photoURL);
            });
            $("#wap").fadeIn(500);
        }




        //Step01
        //Step01 Save
        $("#step01_save").on("click",function(){
            const stepKey = new Date().toLocaleString('ja-JP');
            const value = $("#step01_value").val();
            if(value !== ""){
                const step01idea = {
                    stepKey: stepKey,
                    idea: value
                }
                const newPostRef = push(dbRef01);
                set(newPostRef,step01idea);

                $("#step01_value").val(""); // 入力項目を消す
            }
        });

        //Step01 保存データ表示
        onChildAdded(dbRef01,function(data){
        const key = data.key;//削除・更新に必須
        const step01key = data.val().stepKey;
        const step01idea = data.val().idea;

        let html = '<tr id="' + key + '">';
            html += '<td class="p-2 border w-px whitespace-nowrap"><input type="image" src="./img/clear.svg" data-key="' + key + '" class="clear block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></td>';
            html += '<th class="p-2 border w-px whitespace-nowrap">' + step01key.slice(0, -3) + '</th>';
            html += '<td class="p-2 border" contentEditable="true" id="' + key + '_update">' + step01idea + '</td>';
            html += '<td class="p-2 border w-px whitespace-nowrap"><input type="image" src="./img/update.svg" data-key="' + key + '" class="update block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></td>';
            html += '</tr>';

            $("#step01_list").prepend(html);
        });

        //Step01 データを削除
        $("#step01_list").on("click", ".clear", function(){
            let result = confirm('本当に削除しますか？');
            if(result == true){
                const key = $(this).attr("data-key");
                const remove_item = ref(db,"users/"+uid+"/spet01/"+key);
                remove(remove_item);//firebaseデータ削除
            } else {
                return false;
            }
        });
        //削除処理がされたらfirebaseイベント発生
        onChildRemoved(dbRef01, (data) => {
            $("#"+data.key).remove();
        });

        //Step01 データを更新
        $("#step01_list").on("click", ".update", function(){
            const key = $(this).attr("data-key");
            update(ref(db,"users/"+uid+"/spet01/"+key),{
                idea: $("#"+key+'_update').html()
            });
        });
        //更新処理がされたらfirebaseイベント発生
        onChildChanged(dbRef01, (data) => {
            $("#"+ data.key +'_update').html(data.val().text);
            $("#"+ data.key +'_update').fadeOut(400).fadeIn(400);
        });



        // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

        //Step02
        //Step02 theme
        const randomIndexS2 = Math.floor(Math.random() * themewords.length);
        $("#step02_theme").text(themewords[randomIndexS2]);
        $("#step02_theme_change").on("click", function(){
            const randomIndexS2 = Math.floor(Math.random() * themewords.length);
            $("#step02_theme").text(themewords[randomIndexS2]);
        });

        //Step02 Save
        $("#step02_save").on("click",function(){
            const stepKey = new Date().toLocaleString('ja-JP');
            const value1 = $("#step02_value1").val();
            const value2 = $("#step02_value2").val();
            if(value1 !== "" && value2 !== ""){
                const step02idea = {
                    theme: $("#step02_theme").text(), // #themeの内容も配列に追加
                    stepKey: stepKey,
                    idea1: value1,
                    idea2: value2
                }
                const newPostRef = push(dbRef02);
                set(newPostRef,step02idea);

                $("#step02_value1,#step02_value2").val(""); // 入力項目を消す
            }
        });

        // Step02 保存データ表示
        onChildAdded(dbRef02,function(data){
            const key = data.key;//削除・更新に必須
            const theme = data.val().theme;
            const step02key = data.val().stepKey;
            const step02idea1 = data.val().idea1;
            const step02idea2 = data.val().idea2;
        
            let html = '<tr id="' + key + '">';
                html += '<td class="p-2 border w-px whitespace-nowrap"><input type="image" src="./img/clear.svg" data-key="' + key + '" class="clear block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></td>';
                html += '<th class="p-2 border w-px whitespace-nowrap">' + step02key.slice(0, -3) + '</th>';
                html += '<td class="p-2 border">'
                    html += '<table>'
                        html += '<tr><td class="whitespace-nowrap">単語：</td><td>' + theme + '</td></tr>';
                        html += '<tr><td class="whitespace-nowrap">特性：</td><td contentEditable="true" id="' + key + '_update1" class="w-full">' + step02idea1 + '</td></tr>';
                        html += '<tr><td class="whitespace-nowrap">逆転：</td><td contentEditable="true" id="' + key + '_update2" class="w-full">' + step02idea2 + '</td></tr>';
                    html += '</table>'
                html += '<td class="p-2 border w-px whitespace-nowrap"><input type="image" src="./img/update.svg" data-key="' + key + '" class="update block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></td>';
                html += '</tr>';
        
            $("#step02_list").prepend(html);
        });
        

        //Step02 データを削除
        $("#step02_list").on("click", ".clear", function(){
            let result = confirm('本当に削除しますか？');
            if(result == true){
                const key = $(this).attr("data-key");
                const remove_item = ref(db,"users/"+uid+"/spet02/"+key);
                remove(remove_item);//firebaseデータ削除
            } else {
                return false;
            }
        });
        //削除処理がされたらfirebaseイベント発生
        onChildRemoved(dbRef02, (data) => {
            $("#"+data.key).remove();
        });

        //Step02 データを更新
        $("#step02_list").on("click", ".update", function(){
            const key = $(this).attr("data-key");
            update(ref(db,"users/"+uid+"/spet02/"+key),{
                idea1: $("#"+key+'_update1').html(),
            });
        });
        $("#step02_list").on("click", ".update", function(){
            const key = $(this).attr("data-key");
            update(ref(db,"users/"+uid+"/spet02/"+key),{
                idea2: $("#"+key+'_update2').html()
            });
        });
        //更新処理がされたらfirebaseイベント発生
        onChildChanged(dbRef02, (data) => {
            $("#"+ data.key +'_update1').html(data.val().idea1);
            $("#"+ data.key +'_update1').fadeOut(400).fadeIn(400);
        });
        onChildChanged(dbRef02, (data) => {
            $("#"+ data.key +'_update2').html(data.val().idea2);
            $("#"+ data.key +'_update2').fadeOut(400).fadeIn(400);
        });


        // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー


        //Step03
        //Step03 theme
        const randomIndexS3_1 = Math.floor(Math.random() * themewords.length);
        const randomIndexS3_2 = Math.floor(Math.random() * themewords.length);
        $("#step03_theme").text(themewords[randomIndexS3_1] + " & " + themewords[randomIndexS3_2]);

        $("#step03_theme_change").on("click", function(){
            const randomIndexS3_1 = Math.floor(Math.random() * themewords.length);
            const randomIndexS3_2 = Math.floor(Math.random() * themewords.length);
            $("#step03_theme").text(themewords[randomIndexS3_1] + " & " + themewords[randomIndexS3_2]);
        });

        //Step03 Save
        $("#step03_save").on("click",function(){
            const stepKey = new Date().toLocaleString('ja-JP');
            const value = $("#step03_value").val();
            if(value !== ""){
                const step03idea = {
                    theme: $("#step03_theme").text(), // #themeの内容も配列に追加
                    stepKey: stepKey,
                    idea: value
                }
                const newPostRef = push(dbRef03);
                set(newPostRef,step03idea);

                $("#step03_value").val(""); // 入力項目を消す
            }
        });

        //Step03 保存データ表示
        onChildAdded(dbRef03,function(data){
            const key = data.key;//削除・更新に必須
            const theme = data.val().theme;
            const step03key = data.val().stepKey;
            const step03idea = data.val().idea;
        
            let html = '<tr id="' + key + '">';
                html += '<td class="p-2 border w-px whitespace-nowrap"><input type="image" src="./img/clear.svg" data-key="' + key + '" class="clear block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></td>';
                html += '<th class="p-2 border w-px whitespace-nowrap">' + step03key.slice(0, -3) + '</th>';
                html += '<td class="p-2 border">'
                    html += '<table>'
                        html += '<tr><td class="whitespace-nowrap">単語：</td><td>' + theme + '</td></tr>';
                        html += '<tr><td class="whitespace-nowrap">アイデア：</td><td contentEditable="true" id="' + key + '_update" class="w-full">' + step03idea + '</td></tr>';
                    html += '</table>'
                html += '<td class="p-2 border w-px whitespace-nowrap"><input type="image" src="./img/update.svg" data-key="' + key + '" class="update block w-6 max-w-6 cursor-pointer opacity-50 hover:opacity-20"></td>';
                html += '</tr>';
        
            $("#step03_list").prepend(html);
        });


        //Step03 データを削除
        $("#step03_list").on("click", ".clear", function(){
            let result = confirm('本当に削除しますか？');
            if(result == true){
                const key = $(this).attr("data-key");
                const remove_item = ref(db,"users/"+uid+"/spet03/"+key);
                remove(remove_item);//firebaseデータ削除
            } else {
                return false;
            }
        });
        //削除処理がされたらfirebaseイベント発生
        onChildRemoved(dbRef03, (data) => {
            $("#"+data.key).remove();
        });

        //Step03 データを更新
        $("#step03_list").on("click", ".update", function(){
            const key = $(this).attr("data-key");
            update(ref(db,"users/"+uid+"/spet03/"+key),{
                idea: $("#"+key+'_update').html()
            });
        });
        //更新処理がされたらfirebaseイベント発生
        onChildChanged(dbRef03, (data) => {
            $("#"+ data.key +'_update').html(data.val().text);
            $("#"+ data.key +'_update').fadeOut(400).fadeIn(400);
        });






    } else {
        _redirect();  // User is signed out
    }
});


//###############################################
//Logout処理
//###############################################
$("#out").on("click", function () {
    // signInWithRedirect(auth, provider);
    signOut(auth).then(() => {
        // Sign-out successful.
        _redirect();
    }).catch((error) => {
        // An error happened.
        console.error(error);
    });
});


//###############################################
//Login画面へリダイレクト(関数作成)
//###############################################
function _redirect(){
    location.href="login.html";
}






