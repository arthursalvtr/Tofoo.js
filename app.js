import Tofoo from "./Tofoo.js"
"use strict";
let Tofoojs = new Tofoo("#app", {
    name: 'Eric',
    age: 123,
    hgob: 'asdfsdf',
    members: [
        {id: 1, name: 'luffy', },
        {id: 2, name: 'Sanji', },
        {id: 3, name: 'Zoro', },
    ],
    users: [
        {age: 21, name: 'Nami', },
        {age: 22, name: 'Usop', },
        {age: 23, name: 'Brook', },
    ],
})
Tofoojs.watch('name', _ => console.log(Tofoojs.data.name))
Tofoojs.watch('members', _ => {
    console.log('members updated')
    console.log(Tofoojs.data.members)
})
const query = selector => document.querySelector(selector)
const button = query('#addRow')
const addRow = event => {
    Tofoojs.data.members.push({id: 1, name: 'HAHA'})
}
button.addEventListener('click', addRow)

export default Tofoojs