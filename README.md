`rancher-install-catalog-app` is GitHub action that deploys Rancher's catalog app using Rancher's API.

### Running as a Github action

```yaml
  -     name: Install app
        uses: BitBagCommerce/rancher-install-catalog-app@v0.1
        with:
            chartName: ${{ secrets.CHART_NAME }}
            chartNamespace: ${{ secrets.CHART_NAMESPACE }}
            releaseName: 'some-app'
            appNamespace: 'some-namespace'
            clusterId: ${{ secrets.RANCHER_CLUSTER_ID }}
            projectId: ${{ secrets.RANCHER_PROJECT_ID }}
            rancherToken: ${{ secrets.RANCHER_BEARER_TOKEN }}
            rancherUrl: ${{ secrets.RANCHER_URL }}
            values: |
                some.nested.key: "some_value"
                some.nested.other_key: "some_other_value"
```
## License

Copyright © 2022, BitBagCommerce. Released under the [MIT License](LICENSE).
