import { rebuildPage } from './utils/utils';

document.addEventListener('readystatechange', rebuildPage, { once: true });

function onMutation(mutationList: MutationRecord[], observer: MutationObserver) {
	for (const { addedNodes } of mutationList) {
		for (const node of addedNodes) {
			if (node.nodeName === 'BODY') {
				observer.disconnect();

				document.head.innerHTML = '';
				document.body.style.opacity = '0';
				return;
			}

			if (node.nodeName !== 'HEAD') {
				(node as Element).remove();
			}
		}
	}
}

new MutationObserver(onMutation).observe(document.documentElement, { childList: true });
