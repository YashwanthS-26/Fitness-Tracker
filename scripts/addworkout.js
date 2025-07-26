const arr = JSON.parse(localStorage.getItem('workouts')) || [];

function getTodaysDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString(undefined, options);
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

function generateUniqueId() {
    const localStorageKey = 'generated_ids';

    // Get existing IDs from localStorage or initialize with an empty array
    let storedIds = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Helper function to generate a random alphanumeric 5-character ID
    function getRandomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    // Keep generating until we get a unique one
    let newId;
    do {
        newId = getRandomId();
    } while (storedIds.includes(newId));

    // Add the new ID to the list and update localStorage
    storedIds.push(newId);
    localStorage.setItem(localStorageKey, JSON.stringify(storedIds));

    return newId;
}


function savearr(){
    localStorage.setItem('workouts',JSON.stringify(arr));
}

document.querySelector('.add-btn').addEventListener('click',()=>{
    let val = document.querySelector('.workout-name').value;
    if(val){
        arr.push({
            id: generateUniqueId(),
            workoutName: val
        });
        document.querySelector('.added-alert').innerHTML = `<div class="alert alert-success" role="alert">
  Added Successfully!
</div>
`;
savearr();
displayWorkouts();
setTimeout(()=>{
    document.querySelector('.added-alert').innerHTML = '';
},3000);
    }
    else{
        document.querySelector('.added-alert').innerHTML = `<div class="alert alert-danger" role="alert">
  Enter Some workout Name to continue
</div>
`;
setTimeout(()=>{
    document.querySelector('.added-alert').innerHTML = '';
},3000);
    }
    console.log(arr);
})

function displayWorkouts(){
    let maininnerthtml = '';
    arr.forEach((value,index)=>{
        let eachrow = `<tr class="row${value.id} data-workout-id="${value.id}">
                <td>${value.workoutName}</td>
                <td><i class="fa-solid fa-pen-to-square fa-xl update-icon" data-workout-id="${value.id}"></i></td>
                <td><i class="fa-solid fa-trash fa-xl delete-icon" data-workout-id="${value.id}"></i></td>
            </tr>`
            maininnerthtml+=eachrow;
    });
    document.querySelector('.table-display').innerHTML = maininnerthtml;
}
displayWorkouts();

document.querySelectorAll('.update-icon').forEach((value)=>{
    value.addEventListener('click',()=>{
        let workoutID = value.dataset.workoutId; 
        let inpval = prompt("Enter New Workout Name ");
        if(inpval){
            arr.forEach((ele)=>{
                if(ele.id === workoutID){
                    ele.workoutName = inpval;
                }
            });
            savearr();
            displayWorkouts();
        }
        else{
            alert('Enter Some value in Workout Name. Do not leave empty');
        } 
    });
});

document.querySelectorAll('.delete-icon').forEach((value)=>{
    value.addEventListener('click',()=>{
        let workoutID = value.dataset.workoutId;
        arr.forEach((value,index)=>{
            if(workoutID === value.id){
                arr.splice(index,1);
            }
        });
        savearr();
        displayWorkouts();
    });
});

// 📌 Attach click listener to update icons dynamically
// document.querySelector('.table-display').addEventListener('click', (e) => {
//     if (e.target.classList.contains('update-icon')) {
//         const workoutID = e.target.dataset.workoutId;

//         // Find workout by ID
//         const workoutToEdit = arr.find(item => item.id === workoutID);
//         if (workoutToEdit) {
//             // Pre-fill modal input
//             const input = document.querySelector('.workout-edit-name');
//             input.value = workoutToEdit.workoutName;
//             input.setAttribute('data-edit-id', workoutID);

//             // Show modal
//             const modalElement = document.getElementById('exampleModal');
//             const modal = new bootstrap.Modal(modalElement);
//             modal.show();
//         }
//     }
// });

// // 📌 Save button inside modal
// document.querySelector('.btn-primary').addEventListener('click', () => {
//     const input = document.querySelector('.workout-edit-name');
//     const newName = input.value.trim();
//     const workoutID = input.dataset.editId;

//     if (newName) {
//         const index = arr.findIndex(item => item.id === workoutID);
//         if (index !== -1) {
//             arr[index].workoutName = newName;
//             savearr(); // update localStorage
//             displayWorkouts(); // re-render

//             // Close modal
//             const modalElement = document.getElementById('exampleModal');
//             const modal = bootstrap.Modal.getInstance(modalElement);
//             modal.hide();
//         }
//     }
// });

