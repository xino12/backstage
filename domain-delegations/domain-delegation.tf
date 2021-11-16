# OPS-REQ - {{ values.subdomain }}
test1.beescloud.com
a

module "test1.beescloud.com-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "test1.beescloud.com."
  ns       = "a"
}