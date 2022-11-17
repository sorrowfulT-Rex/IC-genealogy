export function downloadJsonFile(obj) {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(obj)],
        {type: 'text/json'});
    element.href = URL.createObjectURL(file);
    element.download = 'family-tree.json';
    document.body.appendChild(element);
    element.click();
}