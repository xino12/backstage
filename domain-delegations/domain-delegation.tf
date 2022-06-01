# OPS-REQ - {{ values.subdomain }}
{{ parameters.subdomain }}
{{ parameters.gcp_zone }}

module "{{ parameters.subdomain }}-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "{{ parameters.subdomain }}."
  ns       = "{{ parameters.gcp_zone }}"
}