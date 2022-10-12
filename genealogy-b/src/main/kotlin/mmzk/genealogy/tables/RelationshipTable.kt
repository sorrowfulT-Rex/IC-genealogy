package mmzk.genealogy.tables

import org.jetbrains.exposed.dao.IntIdTable
import org.jetbrains.exposed.sql.Table

object RelationshipTable: IntIdTable() {
    val person1 = reference("person1", IndividualTable.id)
    val person2 = reference("person2", IndividualTable.id)
    val type = reference("type", RelationshipTypeTable.id)
}

object RelationshipTypeTable: IntIdTable("relationship_type") {
    val name = varchar("relation_name", 255)
}