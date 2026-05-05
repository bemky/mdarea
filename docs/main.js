import MDArea from 'mdarea';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('textarea').forEach(el => {
        new MDArea(el);
    });
});
