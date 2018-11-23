module.exports = class guildDataHandler {

    /**
     * Initialize a guildDataHandler.
     * @param {Object} datahandler A datahandler instance to use.
     * @param {String} id ID of the guild.
     */
    constructor(datahandler, id) {
        this.datahandler = datahandler;
        this.id = id;
    }

    /**
     * Get the latest data stored for this guild.
     * @returns Guild data.
     */
    async reload() {
        return this.guild = await this.datahandler.getOrAddGuild({ id: this.id });
    }

    /**
     * Get guild data, or the data stored under a key if specified.
     * @param {String} [key] Key under which the data is stored.
     * @returns Guild data.
     */
    async get(key) {
        await this.reload();
        if (typeof key === "undefined")
            return this.guild;
        if (key === "_id") return;
        return this.guild[key];
    }

    /**
     * Set guild data for a key or multiple keys.
     * @param {String|Object} keyOrObject Key to store the data under, or object containing key/value pairs.
     * @param {*} [value] Data to store under the key if a key is specified.
     * @returns Guild data.
     */
    async set(keyOrObject, value) {
        await this.reload();
        let data = keyOrObject;
        if (typeof keyOrObject === "undefined") return;
        if (["string", "number"].includes(typeof keyOrObject)) {
            if (typeof value === "undefined") return;
            if (keyOrObject === "_id") return;
            data = {};
            data[keyOrObject] = value;
        }
        delete data["_id"];
        await this.datahandler.editGuild(this.guild, data);
        return await this.reload();
    }

    /**
     * Remove guild data for a key or multiple keys.
     * @param {String|Object} keyOrObject Key the data is stored under, or multiple keys in an object.
     * @returns Guild data.
     */
    async remove(keyOrObject) {
        let data = keyOrObject;
        await this.reload();
        if (typeof keyOrObject === "undefined") return;
        if (["string", "number"].includes(typeof keyOrObject)) {
            data = {};
            data[keyOrObject] = null;
        }
        delete data["_id"];
        await this.datahandler.editGuild(this.guild, data, true);
        return await this.reload();
    }

    /**
     * Delete all data for this guild.
     * @returns Guild data.
     */
    async delete() {
        await this.reload();
        return await this.datahandler.removeGuild(this.guild);
    }
};