.PHONY: docker-image
docker-image:
	@echo "Building frontend docker image"
	docker build \
		-f $(PWD)/dockerfiles/Dockerfile \
		-t abc-wallet $(PWD)