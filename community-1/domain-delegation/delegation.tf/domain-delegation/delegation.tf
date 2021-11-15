# OPS-REQ - ${{ values.subdomain }}
module "${{ values.subdomain }}-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "${{ values.subdomain }}."
  ns       = "${{ values.gcp-zone }}"
}