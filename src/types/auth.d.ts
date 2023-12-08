type PushMessageEvent = "openstack" | "openstacks" | "resetstack";

export interface PushMessageData {
  type: PushMessageEvent;
  url: string | string[];
}
