/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { UserUtils } from "@webpack/common";

import relationshipNotifier from "./index";
import ChannelDelete from "./types/events/ChannelDelete";
import GuildDelete from "./types/events/GuildDelete";
import RelationshipRemove from "./types/events/RelationshipRemove";
import { getGroup, getGuild, notify } from "./utils";

let manualRemovedFriend, manualRemovedGuild, manualRemovedGroup: string | undefined;

export function onRelationshipRemove(event: RelationshipRemove) {
    if (manualRemovedFriend === event.relationship.id) {
        return void (manualRemovedFriend = undefined);
    }
    if (relationshipNotifier.settings.store.friends) {
        UserUtils.fetchUser(event.relationship.id)
            .then(user => {
                notify(`${user.tag} has removed you as a friend.`, user.getAvatarURL(undefined, undefined, false));
            })
            .catch(() => {});
    }
}

export function onGuildDelete(event: GuildDelete) {
    if (manualRemovedGuild === event.guild.id) {
        return void (manualRemovedGuild = undefined);
    }
    if (relationshipNotifier.settings.store.servers && event.guild.unavailable === undefined) {
        const guild = getGuild(event.guild.id);
        if (guild) {
            notify(`You were removed from the server ${guild.name}`, guild.iconURL);
        }
    }
}

export function onChannelDelete(event: ChannelDelete) {
    if (manualRemovedGroup === event.channel.id) {
        return void (manualRemovedGroup = undefined);
    }
    if (relationshipNotifier.settings.store.groups && event.channel.type === 3) {
        const channel = getGroup(event.channel.id);
        if (channel) {
            notify(`You were removed from the group ${channel.name}`, channel.iconURL);
        }
    }
}
