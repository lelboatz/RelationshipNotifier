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

import definePlugin from "@utils/types";
import { FluxDispatcher } from "@webpack/common";

import { onChannelDelete, onGuildDelete, onRelationshipRemove } from "./functions";
import settings from "./settings";
import { syncGroups, syncGuilds } from "./utils";

export default definePlugin({
    name: "Relationship Notifier",
    description: "Notifies you when a friend, group chat, or server removes you.",
    authors: [],
    settings,
    start() {
        syncGuilds();
        syncGroups();
        FluxDispatcher.subscribe("GUILD_CREATE", syncGuilds);
        FluxDispatcher.subscribe("GUILD_DELETE", onGuildDelete);
        FluxDispatcher.subscribe("CHANNEL_CREATE", syncGroups);
        FluxDispatcher.subscribe("CHANNEL_DELETE", onChannelDelete);
        FluxDispatcher.subscribe("RELATIONSHIP_REMOVE", onRelationshipRemove);
    },
    stop() {
        FluxDispatcher.unsubscribe("GUILD_CREATE", syncGuilds);
        FluxDispatcher.unsubscribe("GUILD_DELETE", onGuildDelete);
        FluxDispatcher.unsubscribe("CHANNEL_CREATE", syncGroups);
        FluxDispatcher.unsubscribe("CHANNEL_DELETE", onChannelDelete);
        FluxDispatcher.unsubscribe("RELATIONSHIP_REMOVE", onRelationshipRemove);
    },
});
