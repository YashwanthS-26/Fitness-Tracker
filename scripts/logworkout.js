    // const workouts = [
    //   { id: 101, workoutName: 'Push Ups' },
    // ];
    const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

    let data = JSON.parse(localStorage.getItem("logWorkout")) || {};
    // console.log(JSON.parse(localStorage.getItem("logWorkout")) || []);
        
//     let data = {
//   "2025-07-25": [
//     { id: 101, workoutName: "Push Ups", time: "10:00 AM" },
//     { id: 106, workoutName: "Leg Press", time: "10:30 AM" }
//   ]
// }
  /* 
{
  "2025-07-25": [
    { id: 101, workoutName: "Push Ups", time: "10:00 AM" },
    { id: 106, workoutName: "Leg Press", time: "10:30 AM" }
  ],
  "2025-07-26": [ ... ]
}
  */


    const searchInput = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('suggestions');
    const modalText = document.getElementById('modalText');
    const addBtn = document.getElementById('addBtn');
    const workoutModal = new bootstrap.Modal(document.getElementById('workoutModal'));
    const logIdArray = JSON.parse(localStorage.getItem('logId')) || [];
    let selectedWorkoutId = null;

    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      suggestionsDiv.innerHTML = '';

      if (query.length === 0) return;

      const matched = workouts.filter(workout =>
        workout.workoutName.toLowerCase().includes(query)
      );

      matched.forEach(workout => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item', 'list-group-item', 'list-group-item-action');
        div.textContent = workout.workoutName;

        div.addEventListener('click', function () {
          searchInput.value = workout.workoutName;
          suggestionsDiv.innerHTML = '';
          selectedWorkoutId = workout.id;
          modalText.textContent = `Do you want to add "${workout.workoutName}"?`;
          workoutModal.show();
        });

        suggestionsDiv.appendChild(div);
      });
    });

    addBtn.addEventListener('click', function () {
      // console.log("Workout ID added:", selectedWorkoutId);
      workouts.forEach((value)=>{
        if(value.id === selectedWorkoutId){
          createLog(value.id,value.workoutName);
        }
      })
      workoutModal.hide();
    });
    function getTodaysDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString(undefined, options);
}


function getTodayKey() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "2025-07-15"
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, make it 12

    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${paddedMinutes} ${ampm}`;
}

function saveDataLog(){
  console.log("Saving data:", data);
  localStorage.setItem("logWorkout", JSON.stringify(data));
}

function createLog(workoutId,workoutName){
 let todayKey = getTodayKey();
 let flag = false; // Initially its not found
 let keys = Object.keys(data);
 keys.forEach((value)=>{
  if(value === todayKey){
    flag = true; // its found
  }
 });
 if(!flag){
  data[`${todayKey}`] = [
    {
      id:workoutId,
      workoutName: workoutName,
      time: getCurrentTime()
    }
  ];
  saveDataLog();
  renderCards();
 }
 else{
  data[`${todayKey}`].push({
      id:workoutId,
      workoutName: workoutName,
      time: getCurrentTime()
  });
  saveDataLog();
  renderCards();
 }
}
function returnWorkoutName(cardId){
  let htmlLog = ``;
  let cardDetail = data[`${cardId}`];
  cardDetail.forEach((value)=>{
    let html = `<tr>
      <td>${value.workoutName}</td>
      <td><i class="fa-solid fa-eye fa-xl view-icon"></i></td>
      <td><i class="fa-solid fa-pen-to-square fa-xl update-icon"></i></td>
    </tr>
`
htmlLog+= html;
  });
  return htmlLog;
}
function renderCards(){
  let keys = Object.keys(data);
  let mainHtml = '';
  let displayEle = document.querySelector('.displayCards');
  keys.forEach((value)=>{
    let eachCard = `
        <div class="card" data-class-id=${value}>
        <div class="card-header card-head-tit">
    ${value}
  </div>
   <div class="card-body">
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Workout</th>
      <th scope="col">View</th>
      <th scope="col">Edit</th>
    </tr>
  </thead>
  <tbody>
  ${returnWorkoutName(value)}
  </tbody>
    </table>
    
   </div>
    </div>
    `
    mainHtml += eachCard;
  });
  displayEle.innerHTML = mainHtml;
}

renderCards();