# OPS-REQ - {{ values.subdomain }}
test.beescloud.com
a

module "test.beescloud.com-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "test.beescloud.com."
  ns       = "a"
}