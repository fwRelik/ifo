window.addEventListener('DOMContentLoaded', () => {
    const iconName = document.querySelector('#icon-name');
    const iconStyle = document.querySelector('#icon-style');
    const iconVersion = document.querySelector('#icon-version');
    const nameButton = document.querySelector('#name-form .preview_button');

    const iconTag = document.querySelector('#icon-tag-name');
    const tagButton = document.querySelector('#tag-form .preview_button');

    const preview = document.querySelector('#preview-icon');
    const copyBtn = document.querySelector('.copy_button');

    async function Request(url) {
        let res = await fetch(url);
        if (!res.ok) throw new Error(`Could not fetch ${url}, status ${res.status}`);
        return res.text();
    }

    function _urlContructor({ version, style, name }) {
        return `https://site-assets.fontawesome.com/releases/${version}/svgs/${style}/${name}.svg`;
    }

    iconName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            nameButton.click();
        }
    });

    nameButton.addEventListener('click', (e) => {
        e.preventDefault();

        const version = iconVersion.value;
        const name = iconName.value.toLowerCase();
        const style = iconStyle.value.toLowerCase();

        Request(_urlContructor({ version, style, name }))
            .then((res) => {
                clearError(iconName);
                setIconPreview(res);
            })
            .catch(() => error(iconName));
    });

    tagButton.addEventListener('click', (e) => {
        e.preventDefault();

        const version = iconVersion.value;
        const options = iconTag.value.match(/".*?"/g).map(item => {
            return item.replace(/"|fa-/g, '');
        })[0].split(' ');

        Request(_urlContructor({
            version,
            style: options[0],
            name: options[1]
        }))
            .then((res) => {
                clearError(iconTag);
                setIconPreview(res);
            })
            .catch(() => error(iconTag));

    });

    copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        copySvg();
        e.target.innerHTML = "Copied!";
        setTimeout(() => {e.target.innerHTML = "Copy SVG"}, 600)
    });

    function error(target) {
        target.previousElementSibling.children[0].hidden = false;
    }

    function clearError(target) {
        target.previousElementSibling.children[0].hidden = true;
    }

    function setIconPreview(icon) {
        const removeCheck = document.querySelector('#remove-checkbox').checked;
        let item = icon;

        if (removeCheck) item = icon.replace(/<!--.*?-->/gs, '');
        preview.innerHTML = item;
        preview.previousElementSibling.textContent = item;
    }

    function copySvg() {
        preview.previousElementSibling.select();
        document.execCommand('copy');
    }
});