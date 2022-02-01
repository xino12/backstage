# OPS-REQ - {{ values.subdomain }}
retro.beescloud.com
a

module "retro.beescloud.com-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "retro.beescloud.com."
  ns       = "a"
}