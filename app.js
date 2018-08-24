import Tofoo from "./Tofoo.js"

let Tofoojs = new Tofoo("#app", {
    name: 'Eric',
    age: 123,
    hgob: 'asdfsdf',
    members: [
        {id: 1, name: 'luffy', },
        {id: 2, name: 'Sanji', },
        {id: 3, name: 'Zoro', },
    ],
})
Tofoojs.watch('name', _ => console.log(Tofoojs.data.name))
Tofoojs.watch('members', _ => {
    console.log('members updated')
    console.log(Tofoojs.data.members)
})
document.querySelector('#add').addEventListener('click', function () {
    console.log('button click')
    Tofoojs.data.name = 'hahaha'
    Tofoojs.data.members.push({ id: 1, name: "Eric" })
})

