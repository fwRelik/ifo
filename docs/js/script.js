window.addEventListener('DOMContentLoaded', () => {
    const tagForm = document.querySelector('#tag-form');
    const nameForm = document.querySelector('#name-form');
    const preview = document.querySelector('#preview-icon');
    const copyBtn = document.querySelector('.copy_button');

    const request = async (url) => {
        let res = await fetch(url);
        if (!res.ok) throw new Error(`Could not fetch ${url}, status ${res.status}`);
        return res.text();
    }

    const _setUrl = ({ version, style, name }) => `https://site-assets.fontawesome.com/releases/${version}/svgs/${style}/${name}.svg`;

    const _getVersion = () => document.querySelector('#icon-version').value;

    const copySvg = () => document.execCommand('copy', false, preview.previousElementSibling.select());

    const setIconPreview = (res) => {
        const removeCheck = document.querySelector('#remove-checkbox').checked;
        let item = res;
        if (removeCheck) item = res.replace(/<!--.*?-->/gs, '');
        preview.innerHTML = item;
        preview.previousElementSibling.textContent = item;
    }

    const error = (selector, status) => {
        selector.querySelector(`.form-label>span`).hidden = !status;
        if (status) setIconPreview('Not found or some problem occurred.');
    }

    const TagForm = (data) => {
        const value = data['icon-tag-name'];
        const detection = value.match(/".*?"/g);
        const options = detection ? detection.map(item => {
            return item.replace(/"|fa-/g, '');
        })[0].split(' ') : error(tagForm, true);

        if (!options) return;

        request(_setUrl({
            version: _getVersion(),
            style: options[0],
            name: options[1]
        }))
            .then(res => {
                error(tagForm, false);
                setIconPreview(res);
            })
            .catch(() => error(tagForm, true));
    }

    const NameForm = (data) => {
        request(_setUrl({
            version: data['icon-version'],
            style: data['icon-style'],
            name: data['icon-name'].toLowerCase()
        }))
            .then(res => {
                error(nameForm, false);
                setIconPreview(res);
            })
            .catch(() => error(nameForm, true))
    }

    function logic(e) {
        let data = {}
        const formData = new FormData(e.target)
        for (var pair of formData.entries()) data[pair[0]] = pair[1];
        if (e.target.id === 'tag-form') TagForm(data);
        else NameForm(data);
    }

    [tagForm, nameForm].forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            logic(e)
        });
    });

    copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copySvg();
        e.target.innerHTML = "Copied!";
        setTimeout(() => { e.target.innerHTML = "Copy SVG" }, 600)
    });
});