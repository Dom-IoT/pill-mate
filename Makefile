ADDON_NAME = pill_mate
ADDONS_DIR = /usr/share/hassio/addons/local

ANSIBLE_ARGS = --inventory ansible/inventory.yml ansible/playbook.yml --extra-vars "addon_name=$(ADDON_NAME)" --extra-vars "addons_dir=$(ADDONS_DIR)"

.PHONY: addon-setup addon-update addon-clean addon-reinstall swagger

addon-setup:
	ansible-playbook $(ANSIBLE_ARGS) --tags setup

addon-update:
	ansible-playbook $(ANSIBLE_ARGS) --tags update

addon-clean:
	ansible-playbook $(ANSIBLE_ARGS) --tags clean

addon-reinstall:
	ansible-playbook $(ANSIBLE_ARGS) --tags reinstall

swagger:
	cd pill_mate/backend; npm run swagger
