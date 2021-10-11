import MDArea from 'mdarea'

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('textarea').forEach(el => {
        new MDArea(el)
    })
})