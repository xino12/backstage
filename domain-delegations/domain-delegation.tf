# OPS-REQ - {{ values.subdomain }}
poc.beescloud.com
a

module "poc.beescloud.com-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "poc.beescloud.com."
  ns       = "a"
}