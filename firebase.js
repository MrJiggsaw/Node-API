window.onload = function(){
var config = {
  apiKey: "AIzaSyAHbZlE1uk55MHFoOHldriyMk_UUicreY4",
  authDomain: "testfirebasestore-d1c98.firebaseapp.com",
  databaseURL: "https://testfirebasestore-d1c98.firebaseio.com",
  projectId: "testfirebasestore-d1c98",
  storageBucket: "testfirebasestore-d1c98.appspot.com",
  messagingSenderId: "192119011683"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();

var doc_ref = firestore.doc("samples/sandwich_Data");
const outputHeader = document.querySelector('#hot_dog_status');
const inputTextField = document.querySelector('#latest_status');
const savebutton = document.querySelector('#saveButton');
const loadButton = document.querySelector('#loadButton');


savebutton.addEventListener("click" , function() {
  const textToUpdate = inputTextField.value;
  console.log('Updated Value ' + textToUpdate);

  doc_ref.set({
    hot_dog_status : textToUpdate
  }).then(function(){
    console.log('Status Updated');
  }).catch(function(err){
    console.log('Something went wrong' + err);
  });
});

loadButton.addEventListener('click' , function() {
  doc_ref.get().then(function(doc){
    if(doc && doc.exists){
    const myData = doc.data();
      outputHeader.innerText = "Hot Dog status:"+myData.hot_dog_status;  
    }
  }).catch(function(err){
    console.log('Error occured'+err);
  });
});

realTimeUpdates = function(){
  doc_ref.onSnapshot(function(doc){
  if(doc && doc.exists){
   const myData = doc.data();
   outputHeader.innerText = "Hot Dog status:"+myData.hot_dog_status;  
  }
  });
}

realTimeUpdates();

}